import type { SortOrderType } from "@calcom/platform-types";
import { Injectable } from "@nestjs/common";
import { PrismaReadService } from "@/modules/prisma/prisma-read.service";
import { PrismaWriteService } from "@/modules/prisma/prisma-write.service";

@Injectable()
export class TeamsEventTypesRepository {
  constructor(
    private readonly dbRead: PrismaReadService,
    private readonly dbWrite: PrismaWriteService
  ) {}

  private readonly safeUserSelect = {
    select: {
      id: true,
      name: true,
      username: true,
      isPlatformManaged: true,
      avatarUrl: true,
      brandColor: true,
      darkBrandColor: true,
      weekStart: true,
      metadata: true,
      organizationId: true,
      organization: {
        select: { slug: true },
      },
      movedToProfile: {
        select: {
          id: true,
          username: true,
          organizationId: true,
          organization: {
            select: {
              id: true,
              slug: true,
              isPlatform: true,
            },
          },
        },
      },
      profiles: {
        select: {
          id: true,
          username: true,
          organizationId: true,
          organization: {
            select: {
              id: true,
              slug: true,
              isPlatform: true,
            },
          },
        },
      },
    },
  } as const;

  async getTeamEventType(teamId: number, eventTypeId: number) {
    return this.dbRead.prisma.eventType.findUnique({
      where: {
        id: eventTypeId,
        teamId,
      },
      include: {
        users: this.safeUserSelect,
        schedule: true,
        hosts: true,
        destinationCalendar: true,
        calVideoSettings: true,
      },
    });
  }

  async getTeamEventTypeBySlug(teamId: number, eventTypeSlug: string, hostsLimit?: number) {
    return this.dbRead.prisma.eventType.findUnique({
      where: {
        teamId_slug: {
          teamId,
          slug: eventTypeSlug,
        },
      },
      include: {
        users: this.safeUserSelect,
        schedule: true,
        hosts: hostsLimit
          ? {
              take: hostsLimit,
            }
          : true,
        destinationCalendar: true,
        calVideoSettings: true,
        team: {
          select: {
            bannerUrl: true,
            name: true,
            logoUrl: true,
            slug: true,
            weekStart: true,
            brandColor: true,
            darkBrandColor: true,
            theme: true,
          },
        },
      },
    });
  }

  async getEventTypeByTeamIdAndSlug(teamId: number, eventTypeSlug: string) {
    return this.dbRead.prisma.eventType.findUnique({
      where: {
        teamId_slug: {
          teamId,
          slug: eventTypeSlug,
        },
      },
    });
  }

  async getEventTypeByTeamIdAndSlugWithOwnerAndTeam(teamId: number, eventTypeSlug: string) {
    return this.dbRead.prisma.eventType.findUnique({
      where: {
        teamId_slug: {
          teamId,
          slug: eventTypeSlug,
        },
      },
      include: { owner: this.safeUserSelect, team: true },
    });
  }

  async getTeamEventTypes(teamId: number, sortCreatedAt?: SortOrderType) {
    return this.dbRead.prisma.eventType.findMany({
      where: {
        teamId,
      },
      ...(sortCreatedAt && { orderBy: { id: sortCreatedAt } }),
      include: {
        users: this.safeUserSelect,
        schedule: true,
        hosts: true,
        destinationCalendar: true,
        calVideoSettings: true,
        team: {
          select: {
            bannerUrl: true,
            name: true,
            logoUrl: true,
            slug: true,
            weekStart: true,
            brandColor: true,
            darkBrandColor: true,
            theme: true,
          },
        },
      },
    });
  }

  async getEventTypeById(eventTypeId: number) {
    return this.dbRead.prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        users: this.safeUserSelect,
        schedule: true,
        hosts: true,
        destinationCalendar: true,
        calVideoSettings: true,
      },
    });
  }

  async getEventTypeChildren(eventTypeId: number) {
    return this.dbRead.prisma.eventType.findMany({
      where: { parentId: eventTypeId },
      include: { users: this.safeUserSelect, schedule: true, hosts: true, destinationCalendar: true },
    });
  }

  async getEventTypeByIdWithChildren(eventTypeId: number) {
    return this.dbRead.prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: { children: true },
    });
  }

  async deleteUserManagedTeamEventTypes(userId: number, teamId: number) {
    return this.dbWrite.prisma.eventType.deleteMany({
      where: {
        parent: {
          teamId,
        },
        userId,
      },
    });
  }

  async removeUserFromTeamEventTypesHosts(userId: number, teamId: number) {
    return this.dbWrite.prisma.host.deleteMany({
      where: {
        userId,
        eventType: {
          teamId,
        },
      },
    });
  }

  async getByIdIncludeHostsAndUserDefaultSchedule(eventTypeId: number, teamId: number) {
    return this.dbRead.prisma.eventType.findUnique({
      where: {
        id: eventTypeId,
        teamId,
      },
      select: {
        id: true,
        scheduleId: true,
        hosts: {
          select: {
            scheduleId: true,
            userId: true,
            user: {
              select: {
                defaultScheduleId: true,
              },
            },
          },
        },
      },
    });
  }
}
